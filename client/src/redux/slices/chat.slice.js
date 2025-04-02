import tokenApi from "@/lib/axios/tokenApi";
import openApi from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
     myChatDetails: null,
     myChatsData: null,
     myGroupsData: null,
     addMemberData: null,
     removeMemberData: null,
     leaveChatData: null,
     messageData: null,
     isLoading: false,
     error: null
}

export const getMyChats = createAsyncThunk(
     "chat/getMyChats",
     async (_, thunkApi) => {
          try {
               const response = await tokenApi.get("/chat/get-my-chat");
               const data = await response.data;
               return data?.chats;
          } catch (error) {
               console.log(error);
               return thunkApi.rejectWithValue(
                    error.response.data || "Something went wrong!"
               );
          }
     }
);

export const getMyGroups = createAsyncThunk("chat/getMyGroups", async(_, thunkApi)=> {
     try {
          const response = await tokenApi.get("/chat/get-my-group");
          const data = await response.data;
          return data?.groups;
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          );
     }
});

export const getMyChatDetails = createAsyncThunk("chat/getMyChatDetails", async(chatId, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/${chatId}`);
          const data = await response.data;
          return data;
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )
     }
});

export const chatSlice = createSlice({
     name: "chat",
     initialState,
     reducers: {
          resetError: (state, action)=> {
               state.error = null
          },
          resetMyChatDetails: (state, action)=> {
               state.myChatDetails = null;
          }
     },
     extraReducers: (builder)=> {
          //get my chats
          builder.addCase(getMyChats.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyChats.fulfilled, (state, action)=> {
               state.isLoading = false;
               state.myChatsData = action?.payload;
          }),
          builder.addCase(getMyChats.rejected, (state, action)=> {
               state.isLoading = false;
               state.error = action?.payload?.message || "Something went wrong!"
          }),
          //get my groups
          builder.addCase(getMyGroups.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyGroups.fulfilled, (state, action)=> {
               state.myGroupsData = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(getMyGroups.rejected, (state, action)=> {
               state.error = action?.payload?.message || "Something went wrong!";
               state.isLoading = false;
          }),
          //get my chat details
          builder.addCase(getMyChatDetails.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyChatDetails.fulfilled, (state, action)=> {
               state.myChatDetails = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(getMyChatDetails.rejected, (state, action)=> {
               state.error = action?.payload?.message || "Something went wrong!";
               state.isLoading = false;
          })
     }
})

export default chatSlice.reducer;
export const { resetError, resetMyChatDetails } = chatSlice.actions;