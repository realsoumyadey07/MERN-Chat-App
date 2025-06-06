import tokenApi from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  unknownUsers: [],
  requests: [],
  friends: [],
  acceptedRequestData: null,
  isLoading: false,
  error: null,
};

export const searchUnknownUser = createAsyncThunk(
  "user/searchUnknownUser",
  async (name, thunkAPI) => {
    try {
      const response = await tokenApi.get(
        `/user/search-unknown-user?name=${name}`
      );
      const data = await response.data;
      return data?.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

export const getAllUnknownUsers = createAsyncThunk(
  "user/getAllUnknownUsers",
  async (_, thunkAPI) => {
    try {
      const response = await tokenApi.get("/user/get-all-unknown-users");
      const data = await response.data;
      return data?.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

export const getAllRequests = createAsyncThunk(
  "user/getAllRequests",
  async (_, thunkAPI) => {
    try {
      const response = await tokenApi.get("/user/get-all-requests");
      const data = await response.data;
      return data?.requests;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

export const getRequestsByName = createAsyncThunk(
  "user/getRequestsByName",
  async (name, thunkAPI) => {
    try {
      const response = await tokenApi.get(`/user/get-requests-by-name?name=${name}`);
      const data = await response.data;
      return data?.requests;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      )
    }
  }
)

export const getMyFriends = createAsyncThunk(
  "user/getMyFriends",
  async (_, thunkAPI) => {
    try {
      const response = await tokenApi.get("/user/get-friends");
      const data = await response.data;
      return data?.friends;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

export const searchMyFriendByName = createAsyncThunk(
  "user/searchMyFriendByName",
  async (name, thunkAPI) => {
    try {
      const response = await tokenApi.get(`/user/search-user?name=${name}`);
      const data = await response.data;
      return data?.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "user/acceptFriendRequest",
  async (formData, thunkAPI) => {
    try {
      const response = await tokenApi.post("/user/accept-friendrequest", {
        requestId: formData?.requestId,
        accept: formData?.accept,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "user/sendFriendRequest",
  async (userId, thunkAPI) => {
    try {
      const response = await tokenApi.post("/user/send-friendrequest", {
        receiverId: userId,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || "Something went wrong!"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUnknownUsers: (state) => {
      state.unknownUsers = [];
    },
    resetRequests: (state) => {
      state.requests = [];
    },
    resetAcceptedRequestData: (state) => {
      state.acceptedRequestData = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //search unknown user
    builder.addCase(searchUnknownUser.pending, (state, action) => {
      state.isLoading = true;
    }),
      builder.addCase(searchUnknownUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unknownUsers = action?.payload;
      }),
      builder.addCase(searchUnknownUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      }),
      //get all unknown users
      builder.addCase(getAllUnknownUsers.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(getAllUnknownUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unknownUsers = action?.payload;
      }),
      builder.addCase(getAllUnknownUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      }),
      //get all requests
      builder.addCase(getAllRequests.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(getAllRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action?.payload;
      }),
      builder.addCase(getAllRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      }),
      //get requests by name
      builder.addCase(getRequestsByName.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(getRequestsByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action?.payload;
      }),
      builder.addCase(getRequestsByName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      }),
      //get all friends
      builder.addCase(getMyFriends.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(getMyFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action?.payload;
      }),
      builder.addCase(getMyFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      }),
      //search my friend by name
      builder.addCase(searchMyFriendByName.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(searchMyFriendByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action?.payload;
      }),
      builder.addCase(searchMyFriendByName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      }),
      //accept friend request
      builder.addCase(acceptFriendRequest.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.acceptedRequestData = action?.payload;
      }),
      builder.addCase(acceptFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      });
      //send friend request
      builder.addCase(sendFriendRequest.pending, (state, action) => {
        state.isLoading = true;
      }),
      builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
      }),
      builder.addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Something went wrong!";
      });
  },
});

export default userSlice.reducer;
export const {
  resetUnknownUsers,
  resetRequests,
  resetAcceptedRequestData,
  resetError,
} = userSlice.actions;
