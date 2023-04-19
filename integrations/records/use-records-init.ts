import { useETHVerifyController } from "@/hooks/use-eth-verify-controller"
import { useRecordsStore, recordsActions, useAppDispatch } from "@/store"
import { ICNSResolverController } from "@rocklabs-io/icns-js"
import { useEffect } from "react"

export const useRecordsInit = () =>{
  
  const { domainName} = useRecordsStore()
  const dispatch = useAppDispatch()
  const resolverActor = new ICNSResolverController()
  const ethVerifyController = useETHVerifyController()


  useEffect(()=>{
    dispatch(recordsActions.setDomainName(document.domain.split('.')[0]))
  }, [])

  useEffect(()=>{
    if(!domainName) return 
    resolverActor.getUserDefaultInfo(domainName+'.icp').then(()=>{
      resolverActor.DefaultInfo && dispatch(recordsActions.setRecords(resolverActor.DefaultInfo))
    })
  }, [domainName])

  useEffect(()=>{
    // get eth addr from icns
    if (ethVerifyController && domainName)
      ethVerifyController.getETHAddr(domainName).then(res => {
        dispatch(recordsActions.setVerifiedETHAddr(res))
    })
  }, [domainName])
}