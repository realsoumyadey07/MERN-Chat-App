import { tokenApi } from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ChatState = {
     newCreatedGroup: any | null,
     myChatDetails: any | null,
     myChatsData: any | null,
     myGroupsData: any | null,
     addMemberData: any | null,
     removeMemberData: any | null,
     leaveChatData: any | null,
     messageData: any[],
     isLoading: boolean,
     error: any | null
};

const initialState: ChatState = {
     newCreatedGroup: null,
     myChatDetails: null,
     myChatsData: null,
     myGroupsData: null,
     addMemberData: null,
     removeMemberData: null,
     leaveChatData: null,
     messageData: [],
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
          } catch (error: any) {
               console.log(error);
               return thunkApi.rejectWithValue(
                    error.response.data || "Something went wrong!"
               );
          }
     }
);

export const getMyChatByName = createAsyncThunk("chat/getMyChatByName", async(name: string, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/get-my-chat-by-name?name=${name}`);
          const data = await response.data;
          return data?.chats;
     } catch (error: any) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )
     }
});

export const getMyGroups = createAsyncThunk("chat/getMyGroups", async(_, thunkApi)=> {
     try {
          const response = await tokenApi.get("/chat/get-my-group");
          const data = await response.data;
          return data?.groups;
     } catch (error: any) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          );
     }
});

export const getMyGroupByName = createAsyncThunk("chat/getMyGroupByName", async(groupName: string, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/get-my-group-by-name?name=${groupName}`);
          const data = await response.data;
          return data?.groups;
     } catch (error: any) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          );
     }
});

export const getMyChatDetails = createAsyncThunk("chat/getMyChatDetails", async(chatId: string, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/${chatId}`);
          const data = await response.data;
          return data;
     } catch (error: any) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )
     }
});

export const getMyMessages = createAsyncThunk("chat/getMyMessages", async(chatId: string, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/message/${chatId}`);
          const data = await response.data;
          return data?.messages;
     } catch (error: any) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          );
     }
});

type GroupData = {
     name: string;
     members: any[];
};

export const createNewGroup = createAsyncThunk("chat/createNewGroup", async(groupData: GroupData, thunkApi)=> {
     try {
          const response = await tokenApi.post("/chat/new-group-chat", {
               name: groupData?.name,
               members: groupData?.members
          });
          const data = await response.data;
          return data;
     } catch (error: any) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )
     }
});

export const chatSlice = createSlice({
     name: "chat",
     initialState,
     reducers: {
          resetMessages: (state)=> {
               state.messageData = [];
          },
          resetError: (state)=> {
               state.error = null;
          },
          resetMyChatDetails: (state)=> {
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
               state.error = action?.payload || "Something went wrong!"
          }),
          //get my chats by name
          builder.addCase(getMyChatByName.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyChatByName.fulfilled, (state, action)=> {
               state.isLoading = false;
               state.myChatsData = action?.payload;
          }),
          builder.addCase(getMyChatByName.rejected, (state, action)=> {
               state.isLoading = false;
               state.error = action?.payload || "Something went wrong!"
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
               state.error = action?.payload || "Something went wrong!";
               state.isLoading = false;
          }),
          //get my group by name
          builder.addCase(getMyGroupByName.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyGroupByName.fulfilled, (state, action)=> {
               state.myGroupsData = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(getMyGroupByName.rejected, (state, action)=> {
               state.error = action?.payload || "Something went wrong!";
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
               state.error = action?.payload || "Something went wrong!";
               state.isLoading = false;
          }),
          //get my messages
          builder.addCase(getMyMessages.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyMessages.fulfilled, (state, action)=> {
               state.messageData = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(getMyMessages.rejected, (state, action)=> {
               state.error = action?.payload || "Something went wrong!";
               state.isLoading = false;
          }),
          //create new group
          builder.addCase(createNewGroup.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(createNewGroup.fulfilled, (state, action)=> {
               state.newCreatedGroup = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(createNewGroup.rejected, (state, action)=> {
               state.error = action?.payload || "Something went wrong!";
               state.isLoading = false;
          })
     }
})

export default chatSlice.reducer;
export const { resetError, resetMyChatDetails, resetMessages } = chatSlice.actions;