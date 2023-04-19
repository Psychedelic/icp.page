import { plug } from "@/integrations/plug"
import { usePlugStore } from "@/store"
import { ActorAdapter, createResolverActor, ICNSResolverController } from "@rocklabs-io/icns-js"
import { useEffect, useState } from "react"


export const useResolverController = () => {
  const { principalId } = usePlugStore()
  const [controller, setController] = useState(new ICNSResolverController())
  const actorAdapter = new ActorAdapter(plug)

  useEffect(() => {
    if (principalId) {
      createResolverActor({actorAdapter}).then((actor) => {
        const _controller = new ICNSResolverController(actor);
        setController(_controller)
        // console.log('set new controller')
      })
    }
  }, [ICNSResolverController, principalId])

  return controller
}