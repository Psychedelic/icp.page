import { useEffect } from 'react';
import {
  FeatureState,
  plugActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';


import { checkIsConnected, getPrincipal } from '.';
import { ICNSReverseController } from 'icns-js';

export const usePlugInit = () => {
  const { isConnected } = usePlugStore();
  const dispatch = useAppDispatch();
  const reverseNameActor = new ICNSReverseController()

  useEffect(() => {
    dispatch(plugActions.setState(FeatureState.Loading));
    const connectionPromise = checkIsConnected();
    if (connectionPromise) {
      connectionPromise.then(async (isConnected: boolean) => {
        dispatch(plugActions.setIsConnected(isConnected));
      })
        .catch((err: any) => {
          console.error(err);
          dispatch(plugActions.setIsConnected(false));
        });
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      const getPrincipalId = async () => {
        try {
          const principal = await getPrincipal();
          if (principal) {
            dispatch(plugActions.setPrincipalId(principal.toString()));
            const reverseName = await reverseNameActor.getReverseName(principal)
            if (reverseName)
              dispatch(plugActions.setReverseName(reverseName as string))
          }
          dispatch(plugActions.setState(FeatureState.Idle));
        } catch (err) {
          console.error(err);
          dispatch(plugActions.setState(FeatureState.Error));
        }
      };

      const isPlug = Boolean(window.ic?.plug);
      if (isPlug) {
        getPrincipalId();
      }
    }

    dispatch(plugActions.setState(FeatureState.Idle));
  }, [isConnected]);
};