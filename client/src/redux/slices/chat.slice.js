import openApi from "@/lib/axios/tokenApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
     newCreatedChatData: null,
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
     async (formData, thunkApi) => {
          try {
               const response = await openApi.get("/chat/get-my-chat");
               const data = await response.json();
               return data.chats;
          } catch (error) {
               console.log(error);
               return thunkApi.rejectWithValue(
                    error.response.data || "Something went wrong!"
               );
          }
     }
)

export const chatSlice = createSlice({
     name: "chat",
     initialState,
     reducers: {
          resetError: (state, action)=> {
               state.error = null
          }
     },
     extraReducers: (builder)=> {
          //grt my chats
          builder.addCase(getMyChats.pending, (state, action)=> {
               state.isLoading = true;
          }),
          builder.addCase(getMyChats.fulfilled, (state, action)=> {
               state.isLoading = false;
               state.myChatsData = action.payload;
               console.log("action.payload: "+ action.payload);
          }),
          builder.addCase(getMyChats.rejected, (state, action)=> {
               state.isLoading = false;
               state.error = action.error || action.error.message
          })
          
     }
})

export default chatSlice.reducer;
export const { resetError } = chatSlice.actions;