import openApi from "@/lib/axios/openApi";
import tokenApi from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerUserData: null,
  loginUserData: null,
  logoutUserData: null,
  userData: null,
  userDetails: null,
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
      console.log("here is data: "+data);   
      return data?.user;
    } catch (error) {
      console.log(error?.response?.data);
      return thunkAPI.rejectWithValue(error?.response?.data);
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
      return thunkAPI.rejectWithValue(error?.response?.data || "Something went wrong");
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await tokenApi.get("/user/user-logout");
    const data = await response.data;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || "Something went wrong!");
  }
});

export const getProfileData = createAsyncThunk(
  "auth/profileData",
  async (_, thunkAPI) => {
    try {
      const response = await tokenApi.get("/user/get-profile");
      const data = await response.data;
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || "Something went worng!");
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "auth/userDetails",
  async (profileId, thunkAPI)=> {
    try {
      const response = await tokenApi.get(`/user/get-user-details/${profileId}`);
      const data = await response.data;
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || "Something went wrong!");
    }
  }
)

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
    resetRegisterUserData: (state)=> {
      state.registerUserData = null;
    },
    resetLogoutData: {
      reducer: (state) => {
        state.logoutUserData = null;
      }
    },
    resetUserData: (state)=> {
      state.userData = null;
    },
    resetUserDetails: (state)=> {
      state.userDetails = null;
    }
  },
  extraReducers: (builder) => {
    //for registration
    builder.addCase(registration.pending, (state, action) => {
      state.isLoading = true
    });
    builder.addCase(registration.fulfilled, (state, action) => {
      state.isLoading = false 
      state.registerUserData = action.payload;
    });
    builder.addCase(registration.rejected, (state, action) => {
      state.isLoading = false
      console.log("action error in build case: "+ action?.payload?.message);
      state.error = action?.payload?.message
    });

    //for login
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.loginUserData = action.payload
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false
      state.error = action?.payload?.message
    });
    
    //logout user data
    builder.addCase(logOut.pending, (state, action) => {
      state.isLoading = true
    });
    builder.addCase(logOut.fulfilled, (state, action) => {
      state.isLoading = false
      state.logoutUserData = action.payload
    });
    builder.addCase(logOut.rejected, (state, action) => {
      state.isLoading = false
      state.error = action?.payload?.message
    });

    //get user data
    builder.addCase(getProfileData.pending, (state, action) => {
      state.isLoading = true
    });
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.isLoading = false
      state.userData = action.payload
    });
    builder.addCase(getProfileData.rejected, (state, action) => {
      state.isLoading = false
      state.error = action?.payload?.message
    });

    //get user details
    builder.addCase(getUserDetails.pending, (state, action)=> {
      state.isLoading = true;
    }),
    builder.addCase(getUserDetails.fulfilled, (state, action)=> {
      state.userDetails = action?.payload;
      state.isLoading = false;
    }),
    builder.addCase(getUserDetails.rejected, (state, action)=> {
      state.error = action?.payload?.message;
      state.isLoading = false;
    })
  },
});

export default authSlice.reducer;
export const { resetError, resetLoginUserData, resetRegisterUserData, resetLogoutData, resetUserData, resetUserDetails } = authSlice.actions;
