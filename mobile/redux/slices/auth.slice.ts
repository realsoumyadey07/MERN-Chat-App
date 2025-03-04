import openApi from "@/lib/axios/openApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenApi } from "@/lib/axios/tokenApi";

interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginUserRequest {
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  registerUserData: RegisterUserResponse["user"] | null;
  loginUserData: LoginResponse["user"] | null;
  logoutUserData: any;
  userData: any;
  isLoading: boolean;
  error: any | null;
}

const initialState: AuthState = {
  registerUserData: null,
  loginUserData: null,
  logoutUserData: null,
  userData: null,
  isLoading: false,
  error: null,
};

export const registration = createAsyncThunk<
  RegisterUserResponse["user"],
  RegisterUserRequest,
  { rejectValue: { message: string } }
>("auth/registration", async (formData, thunkAPI) => {
  try {
    const response = await openApi.post("/user/user-registration", {
      username: formData?.username,
      email: formData?.email,
      password: formData?.password,
    });
    const data = await response.data;
    console.log("here is data: " + data);
    return data?.user;
  } catch (error: any) {
    console.log(error?.response?.data);
    return thunkAPI.rejectWithValue(error?.response?.data);
  }
});

export const login = createAsyncThunk<
  LoginResponse["user"],
  LoginUserRequest,
  { rejectValue: { message: string } }
>("auth/login", async (formData, thunkAPI) => {
  try {
    console.log(process.env.EXPO_PUBLIC_BASE_URL);
    const response = await openApi.post("/user/user-login", {
      email: formData?.email,
      password: formData?.password,
    });
    const data = response.data;
    console.log("login data: " + data?.access_token);
    await AsyncStorage.setItem("access_token", String(data?.access_token));
    await AsyncStorage.setItem("refresh_token", String(data?.refresh_token));
    return data?.user;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(
      error?.response?.data || "Something went wrong"
    );
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await tokenApi.get("/user/user-logout");
    const data = response.data;
    if (response.status === 200) {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
    }
    console.log("logout data: " + data);
    return data;
  } catch (error: any) {
    console.log("error in logout: " + error);
    return thunkAPI.rejectWithValue(
      error?.response?.data || "Something went wrong"
    );
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //for registration
    builder.addCase(registration.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(registration.fulfilled, (state, action) => {
      state.isLoading = false;
      state.registerUserData = action.payload;
    });
    builder.addCase(registration.rejected, (state, action) => {
      state.isLoading = false;
      console.log("action error in build case: " + action?.payload?.message);
      state.error = action?.payload?.message;
    });
    //for login
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.loginUserData = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message;
    });
    //for logout
    builder.addCase(logout.pending, (state, action)=> {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state, action)=> {
      state.logoutUserData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(logout.rejected, (state, action)=> {
      state.error = action?.payload;
      state.isLoading = false;
    });
  },
});

export default authSlice.reducer;
