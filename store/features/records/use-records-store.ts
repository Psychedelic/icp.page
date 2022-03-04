import { selectRecordsState, useAppSelector } from "@/store";

export const useRecordsStore = () => useAppSelector(selectRecordsState)