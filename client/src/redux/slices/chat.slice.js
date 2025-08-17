import tokenApi from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
     newCreatedGroup: null,
     myChatDetails: null,
     myChatsData: null,
     myGroupsData: null,
     addMemberData: null,
     removeMemberData: null,
     leaveChatData: null,
     renamedGroupData: null,
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
          } catch (error) {
               console.log(error);
               return thunkApi.rejectWithValue(
                    error.response.data || "Something went wrong!"
               );
          }
     }
);

export const getMyChatByName = createAsyncThunk("chat/getMyChatByName", async(name, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/get-my-chat-by-name?name=${name}`);
          const data = await response.data;
          return data?.chats;
     } catch (error) {
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
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          );
     }
});

export const getMyGroupByName = createAsyncThunk("chat/getMyGroupByName", async(groupName, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/get-my-group-by-name?name=${groupName}`);
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

export const getMyMessages = createAsyncThunk("chat/getMyMessages", async(chatId, thunkApi)=> {
     try {
          const response = await tokenApi.get(`/chat/message/${chatId}`);
          const data = await response.data;
          return data?.messages;
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          );
     }
});

export const createNewGroup = createAsyncThunk("chat/createNewGroup", async(groupData, thunkApi)=> {
     try {
          const response = await tokenApi.post("/chat/new-group-chat", {
               name: groupData?.name,
               members: groupData?.members
          });
          const data = await response.data;
          return data;
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )
     }
});

export const renameGroup = createAsyncThunk("chat/renameGroup", async(groupData, thunkApi)=> {
     try {
          await tokenApi.put(`/chat/${groupData?.groupId}`, {
               newName: groupData?.newName
          });
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )       
     }
});

export const deleteGroup = createAsyncThunk("chat/deleteGroup", async(groupId, thunkApi)=> {
     try {
          await tokenApi.delete(`/chat/${groupId}`);
     } catch (error) {
          return thunkApi.rejectWithValue(
               error?.response?.data || "Something went wrong!"
          )
     }
})

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
          //get my group by name
          builder.addCase(getMyGroupByName.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyGroupByName.fulfilled, (state, action)=> {
               state.myGroupsData = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(getMyGroupByName.rejected, (state, action)=> {
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
               state.error = action?.payload?.message || "Something went wrong!";
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
               state.error = action?.payload?.message || "Something went wrong!";
               state.isLoading = false;
          }),
          //rename a group
          builder.addCase(renameGroup.pending, (state, _)=> {
               state.isLoading = true;
          }),
          builder.addCase(renameGroup.fulfilled, (state, action)=> {
               state.renamedGroupData = action?.payload;
               state.isLoading = false;
          }),
          builder.addCase(renameGroup.rejected, (state, action)=> {
               state.error = action?.payload?.message || "Something went wrong!";
               state.isLoading = false;
          }),
          //delete a group
          builder.addCase(deleteGroup.pending, (state, _)=> {
               state.isLoading = true;
          }),
          builder.addCase(deleteGroup.fulfilled, (state, _)=> {
               state.isLoading = false;
          }),
          builder.addCase(deleteGroup.rejected, (state, action)=> {
               state.error = action?.payload?.message || "Something went wrong!";
               state.isLoading = false;
          })
     }
})

export default chatSlice.reducer;
export const { resetError, resetMyChatDetails } = chatSlice.actions;