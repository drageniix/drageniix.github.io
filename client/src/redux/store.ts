import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import subscribe from './subscribe';

const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = (window as any).store
    ? (window as any).store
    : ((window as any).store = createStore(
          reducer,
          composeEnhancers(applyMiddleware(thunk))
      ));

subscribe(store);
export default store;
