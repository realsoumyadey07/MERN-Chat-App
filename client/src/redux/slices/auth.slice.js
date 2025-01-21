import openApi from "@/lib/axios/openApi";
import tokenApi from "@/lib/axios/tokenApi";
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
      const response = await openApi.post("/user/user-registration", {
        username: formData?.username,
        email: formData?.email,
        password: formData?.password,
      });
      
      const data = await response.data;
      return data?.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const response = await openApi.post("/user/user-login", {
        email: formData?.email,
        password: formData?.password,
      });
      const data = await response.data;
      console.log("login data: "+ data?.access_token);
      localStorage.setItem("access_token", data?.access_token);
      localStorage.setItem("refresh_token", data?.refresh_token);
      return data?.user;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await tokenApi.get("/user/user-logout");
    const data = response.data;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Something went wrong!");
  }
});

export const getUserData = createAsyncThunk(
  "auth/userData",
  async (_, thunkAPI) => {
    try {
      const response = await tokenApi.get("/user/get-user");
      const data = await response.data;
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went worng!");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetLoginUserData: (state)=> {
      state.loginUserData = null;
    },
    resetLogoutData: {
      reducer: (state) => {
        state.logoutUserData = null;
      }
    },
    resetUserData: (state)=> {
      state.userData = null;
    }
  },
  extraReducers: (builder) => {
    //for registration
    builder.addCase(registration.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(registration.fulfilled, (state, action) => {
      (state.isLoading = false), 
      (state.registerUserData = action.payload);
      console.log(action.payload);
    });
    builder.addCase(registration.rejected, (state, action) => {
      (state.isLoading = false),
      (state.error = action.payload || action.error.message);
    });

    //for login
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      (state.isLoading = false), 
      (state.loginUserData = action.payload);
    });
    builder.addCase(login.rejected, (state, action) => {
      (state.isLoading = false),
        (state.error = action.payload || action.error.message);
    });
    
    //logout user data
    builder.addCase(logOut.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(logOut.fulfilled, (state, action) => {
      state.isLoading = false;
      state.logoutUserData = action.payload;
    });
    builder.addCase(logOut.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });

    //get user data
    builder.addCase(getUserData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export default authSlice.reducer;
export const { resetError, resetLoginUserData, resetLogoutData, resetUserData } = authSlice.actions;
