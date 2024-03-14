import {usePrimeVue} from "primevue/config";
import {ref} from "vue";


export const useThemes = () => {
    const PrimeVue = usePrimeVue();
    const theme = ref('aura-light-green')
    const changeTheme = (newTheme) => {
        PrimeVue.changeTheme(theme.value, newTheme, 'theme-link', () => {
        });
        theme.value = newTheme;
    }
    const themes = [
        {
            "label": "md-light-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('md-light-indigo')
        },
        {
            "label": "md-light-deeppurple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('md-light-deeppurple')
        },
        {
            "label": "md-dark-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('md-dark-indigo')
        },
        {
            "label": "md-dark-deeppurple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('md-dark-deeppurple')
        },
        {
            "label": "mdc-light-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('mdc-light-indigo')
        },
        {
            "label": "mdc-light-deeppurple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('mdc-light-deeppurple')
        },
        {
            "label": "mdc-dark-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('mdc-dark-indigo')
        },
        {
            "label": "mdc-dark-deeppurple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('mdc-dark-deeppurple')
        },
        {
            "label": "aura-light-blue",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-blue')
        },
        {
            "label": "aura-light-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-indigo')
        },
        {
            "label": "aura-light-purple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-purple')
        },
        {
            "label": "aura-light-teal",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-teal')
        },
        {
            "label": "aura-light-green",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-green')
        },
        {
            "label": "aura-light-amber",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-amber')
        },
        {
            "label": "aura-light-cyan",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-cyan')
        },
        {
            "label": "aura-light-pink",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-pink')
        },
        {
            "label": "aura-light-lime",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-lime')
        },
        {
            "label": "aura-light-noir",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-light-noir')
        },
        {
            "label": "aura-dark-blue",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-blue')
        },
        {
            "label": "aura-dark-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-indigo')
        },
        {
            "label": "aura-dark-purple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-purple')
        },
        {
            "label": "aura-dark-teal",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-teal')
        },
        {
            "label": "aura-dark-green",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-green')
        },
        {
            "label": "aura-dark-amber",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-amber')
        },
        {
            "label": "aura-dark-cyan",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-cyan')
        },
        {
            "label": "aura-dark-pink",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-pink')
        },
        {
            "label": "aura-dark-lime",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-lime')
        },
        {
            "label": "aura-dark-noir",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('aura-dark-noir')
        },
        {
            "label": "lara-light-blue",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-blue')
        },
        {
            "label": "lara-light-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-indigo')
        },
        {
            "label": "lara-light-purple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-purple')
        },
        {
            "label": "lara-light-teal",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-teal')
        },
        {
            "label": "lara-light-green",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-green')
        },
        {
            "label": "lara-light-amber",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-amber')
        },
        {
            "label": "lara-light-cyan",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-cyan')
        },
        {
            "label": "lara-light-pink",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-light-pink')
        },
        {
            "label": "lara-dark-blue",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-blue')
        },
        {
            "label": "lara-dark-indigo",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-indigo')
        },
        {
            "label": "lara-dark-purple",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-purple')
        },
        {
            "label": "lara-dark-teal",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-teal')
        },
        {
            "label": "lara-dark-green",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-green')
        },
        {
            "label": "lara-dark-amber",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-amber')
        },
        {
            "label": "lara-dark-cyan",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-cyan')
        },
        {
            "label": "lara-dark-pink",
            "icon": "pi pi-bolt",
            "command": () => changeTheme('lara-dark-pink')
        }
    ]
    return {
        themes,
        changeTheme,
        theme
    }
}