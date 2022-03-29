import { useRecordsStore, recordsActions, useAppDispatch } from "@/store"
import { ICNSRegistryController, ICNSResolverController } from "icns-js"
import { useEffect } from "react"

export const useRecordsInit = () => {

  const { domainName } = useRecordsStore()
  const dispatch = useAppDispatch()
  const resolverActor = new ICNSResolverController()
  const registryActor = new ICNSRegistryController()

  useEffect(() => {
    dispatch(recordsActions.setDomainName(document.domain.split('.')[0]))
  }, [])

  useEffect(() => {
    if (!domainName) return
    // get editor name 
    registryActor.getRecord(domainName).then((res)=>{
      if(res){
        dispatch(recordsActions.setEditor([res.controller.toString(), res.owner.toString()]))
      }
    })

    // get text info
    resolverActor.getUserDefaultInfo(domainName + '.icp').then(() => {
      resolverActor.DefaultInfo && dispatch(recordsActions.setRecords(resolverActor.DefaultInfo))
    })
  }, [domainName])
}