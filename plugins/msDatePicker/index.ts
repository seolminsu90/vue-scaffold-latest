import MsDatePicker from './MsDatePicker.vue'
import type {App} from 'vue'
import './ms-datepicker.scss'

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        MsDatePicker: typeof MsDatePicker;
    }
}

export default {
    install: (app: App, options = {}) => {
        const componentName = 'MsDatePicker'

        app.component(componentName, MsDatePicker);
    }
};

export {MsDatePicker}
