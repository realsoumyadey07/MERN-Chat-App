import { tokenApi } from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type UserState = {
  requests: any[];
  suggestions: any[];
  isLoading: boolean;
  error: any | null;
};

const initialState: UserState = {
  requests: [],
  suggestions: [],
  isLoading: false,
  error: null,
};

export const getAllRequests = createAsyncThunk(
  "user/getAllRequests",
  async (_, thunkApi) => {
    try {
      const res = await tokenApi.get("/user/get-all-requests");
      const data = await res.data;
      return data?.requests;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
);

export const getRequestByName = createAsyncThunk(
  "user/getRequestByName",
  async (name: string, thunkApi) => {
    try {
      console.log("name is: ", name);
      const response = await tokenApi.get(
        `/user/get-requests-by-name?name=${name}`
      );
      const data = await response.data;
      return data?.requests;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
);

interface AcceptRequest {
  requestId: string;
  accept: boolean;
}

export const acceptRequest = createAsyncThunk(
  "user/acceptRequest",
  async (formData: AcceptRequest, thunkApi) => {
    try {
      await tokenApi.post("/user/accept-friendrequest", {
        requestId: formData?.requestId,
        accept: formData?.accept,
      });
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
);

export const getAllSuggestions = createAsyncThunk(
  "user/getAllSuggestions",
  async (_, thunkApi) => {
    try {
      const res = await tokenApi.get("/user/get-all-unknown-users");
      const data = await res.data;
      return data?.users;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
);

export const getSuggestionByName = createAsyncThunk(
  "user/getSuggestionByName",
  async (name: string, thunkApi) => {
    try {
      const response = await tokenApi.get(
        `/user/search-unknown-user?name=${name}`
      );
      const data = await response.data;
      return data?.users;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
);

export const sendRequest = createAsyncThunk(
  "user/sendRequest",
  async (receiverId: string, thunkApi) => {
    try {
      await tokenApi.post("/user/send-friendrequest", {receiverId});
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Something went wrong!"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all requests
    builder.addCase(getAllRequests.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllRequests.fulfilled, (state, action) => {
      state.requests = action.payload; // ✅ correct
      state.isLoading = false;
    });
    builder.addCase(getAllRequests.rejected, (state, action) => {
      state.error = action.payload || "Something went wrong!";
      state.isLoading = false;
    });

    //get requests by name
    builder.addCase(getRequestByName.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getRequestByName.fulfilled, (state, action) => {
      state.requests = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(getRequestByName.rejected, (state, action) => {
      state.error = action?.payload || "Something went wrong!";
      state.isLoading = false;
    });

    // get all suggestions
    builder.addCase(getAllSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllSuggestions.fulfilled, (state, action) => {
      state.suggestions = action.payload; // ✅ correct
      state.isLoading = false;
    });
    builder.addCase(getAllSuggestions.rejected, (state, action) => {
      state.error = action.payload || "Something went wrong!";
      state.isLoading = false;
    });

    // get all suggestions by name
    builder.addCase(getSuggestionByName.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSuggestionByName.fulfilled, (state, action) => {
      state.suggestions = action.payload; // ✅ correct
      state.isLoading = false;
    });
    builder.addCase(getSuggestionByName.rejected, (state, action) => {
      state.error = action.payload || "Something went wrong!";
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
