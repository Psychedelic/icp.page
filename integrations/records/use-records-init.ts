import { useRecordsStore, recordsActions, useAppDispatch } from "@/store"
import { ICNSResolverController } from "icns-js"
import { useEffect } from "react"

export const useRecordsInit = () =>{
  
  const { domainName} = useRecordsStore()
  const dispatch = useAppDispatch()
  const resolverActor = new ICNSResolverController()

  useEffect(()=>{
    dispatch(recordsActions.setDomainName(document.domain.split('.')[0]))
  }, [])

  useEffect(()=>{
    if(!domainName) return 
    resolverActor.getUserDefaultInfo(domainName+'.icp').then(()=>{
      resolverActor.DefaultInfo && dispatch(recordsActions.setRecords(resolverActor.DefaultInfo))
    })
  }, [domainName])
}