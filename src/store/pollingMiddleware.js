import { POLLING_IMAGES } from './action-types';
import { getEdgeStatus } from '../api';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux/actions/notifications';
import { loadEdgeImages, removeImagesToPoll } from './actions';

var tid;
const pollingImageMidlleware = ({ getState, dispatch }) => (next) => (
  action
) => {
  if (action.type === `${POLLING_IMAGES}_START`) {
    tid = setInterval(() => {
      const imageIdsHash = getState()['pollingReducer'];
      const ids = Object.keys(imageIdsHash);
      if (ids.length === 0) {
        return;
      }
      getEdgeStatus(ids).then((resp) => {
        let removeImages = [];

        resp.forEach((result) => {
          if (result.status === 'fulfilled') {
            const image = result.value;
            removeImages = [...removeImages, image.ID];
            dispatch(
              addNotification({
                variant: image.Status === 'ERROR' ? 'danger' : 'success',
                title: `Image ${
                  image.Status === 'CREATED'
                    ? 'was created'
                    : image.Status === 'SUCCESS'
                    ? 'is ready'
                    : 'failure'
                }`,
                description: `${image.Name} image build is completed.`,
              })
            );
          }
        });

        const rejectedResult = resp.find(
          (result) => result.status === 'rejected'
        );
        if (rejectedResult !== undefined) {
          dispatch(
            addNotification({
              variant: 'warning',
              title: 'Error pulling status data',
              description: rejectedResult.reason || undefined,
              autoDismiss: true,
              dismissDelay: 2500,
            })
          );
        }

        if (removeImages.length > 0) {
          loadEdgeImages(dispatch);
        }
        dispatch(removeImagesToPoll(removeImages));
      });
    }, action.interval);
  }

  if (action.type === `${POLLING_IMAGES}_END`) {
    clearInterval(tid);
  }

  if (action.type === `${POLLING_IMAGES}_ADD`) {
    loadEdgeImages(dispatch);
    dispatch(
      addNotification({
        title: 'Creating image',
        variant: 'info',
        description: `${action.payload.name} image build was added to the queue.`,
        dismissDelay: 2000,
      })
    );
  }

  return next(action);
};

export default pollingImageMidlleware;
