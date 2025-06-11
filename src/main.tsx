import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from 'react-redux';
import {store} from './app/store.ts';

try {
    createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <App/>
        </Provider>
    )

} catch (error) {
    console.log(error)
}
