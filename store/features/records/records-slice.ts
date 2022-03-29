import { RootState } from "@/store/store";
import { Principal } from "@dfinity/principal";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultInfoExt } from "icns-js";

// use defualt ext interface
const initialState: {domainName: string, 
  editor:Array<string>, 
  records: DefaultInfoExt
} = {
  domainName: '',
  editor: [],
  records: {
    'btc': [],
    'eth': [],
    'icp': [],
    'pid': [],
    'url': [],
    'twitter': [],
    'host': [{ 'url': 'hostUrl' }],
    'canisterExtensions': [],
    'description': [],
    'email': [],
    'textExtensions': [],
    'addrExtensions': [],
    'discord': [],
    'mainCanister': [],
    'telegram': [],
    'github': [],
    'avatar': [],
  }
}

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<object>) => {
      state.records = {...state.records, ...action.payload };
    },
    setEditor: (state, action: PayloadAction<Array<string>>) => {
      state.editor = action.payload;
    },
    setDomainName: (state, action: PayloadAction<string>)=>{
      state.domainName = action.payload;
    }
  }
})

export const recordsActions = recordsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectRecordsState = (state: RootState) => state.records

export default recordsSlice.reducer;