import openApi from "@/lib/axios/openApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerUserData: null,
  loginUserData: null,
  logoutUserData: null,
  userData: null,
  isLoading: false,
  error: null,
};

export const registration = createAsyncThunk(
  "auth/registration",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/user-registration`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
          credentials: "include"
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return thunkAPI.rejectWithValue(errorData || "Something went wrong");
      }
      const data = await response.json();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/user-login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return thunkAPI.rejectWithValue(errorData || "Something went wrong");
      }
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const getUserData = createAsyncThunk(
  "auth/userData",
  async (_, thunkAPI)=> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/get-user`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if(!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return thunkAPI.rejectWithValue(
          errorData || "Something went wrong!"
        )
      }
      const data = await response.json();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went worng!"
      )
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI)=>{
    try {
      const response = await openApi.get("/user/user-logout");
      const data = response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
)

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state, payload)=> {
        state.error = null
    }
  },
  extraReducers: (builder) => {
    //for registration
    builder.addCase(registration.pending, (state, action) => {
      state.isLoading = true;
    }),
      builder.addCase(registration.fulfilled, (state, action) => {
        state.isLoading = false,
        state.registerUserData = action.payload;
        console.log(action.payload);
      }),
      builder.addCase(registration.rejected, (state, action) => {
        state.isLoading = false,
        state.error = action.payload || action.error.message;
      }),
      //for login
      builder.addCase(login.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.isLoading = false,
        state.loginUserData = action.payload;
      }),
      builder.addCase(login.rejected, (state, action) => {
        state.isLoading = false,
        state.error = action.payload || action.error.message;
      }),
      //get user data
      builder.addCase(getUserData.pending, (state, action)=> {
        state.isLoading = true;
      }),
      builder.addCase(getUserData.fulfilled, (state, action)=> {
        state.isLoading = false;
        state.userData = action.payload;
      }),
      builder.addCase(getUserData.rejected, (state, action)=> {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      }),
      //logout user data
      builder.addCase(logOut.pending, (state, action)=> {
        state.isLoading = true;
      }),
      builder.addCase(logOut.fulfilled, (state, action)=> {
        state.isLoading = false;
        state.logoutUserData = action.payload;
      }),
      builder.addCase(logOut.rejected, (state, action)=> {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export default authSlice.reducer;
export const {resetError} = authSlice.actions;