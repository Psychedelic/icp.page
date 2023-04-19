import { plug } from "@/integrations/plug"
import { usePlugStore } from "@/store"
import { ActorAdapter, createETHVerifyActor, ICNSETHVerifyController } from "@rocklabs-io/icns-js"
import { useEffect, useState } from "react"


export const useETHVerifyController = () => {
  const { principalId } = usePlugStore()

const [controller, setController] = useState(new ICNSETHVerifyController())
  const actorAdapter = new ActorAdapter(plug)

  useEffect(() => {
    if (principalId) {
      createETHVerifyActor({actorAdapter}).then((actor) => {
        const _controller = new ICNSETHVerifyController(actor);
        setController(_controller)
      })
    }
  }, [ICNSETHVerifyController, principalId])

  return controller
}