export const useComposable = () => {
    function greeting() {
        alert("Composable을 등록한다.")
    }

    return {
        greeting
    }
}