import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultInfoExt } from "@rocklabs-io/icns-js";

// use defualt ext interface
const initialState: {domainName: string, records: DefaultInfoExt, verifiedETHAddr: string} = {
  domainName: '',
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
  }, 
  verifiedETHAddr: "" // no 0x
}

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<object>) => {
      state.records = {...state.records, ...action.payload };
    },
    setDomainName: (state, action: PayloadAction<string>)=>{
      state.domainName = action.payload
    },
    setVerifiedETHAddr: (state, action: PayloadAction<string>)=>{
      state.verifiedETHAddr = action.payload
    },
  }
})

export const recordsActions = recordsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectRecordsState = (state: RootState) => state.records

export default recordsSlice.reducer;