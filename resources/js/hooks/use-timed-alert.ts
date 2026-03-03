import { useEffect } from "react"

type Setter = React.Dispatch<React.SetStateAction<boolean>>

export function useTimedAlert(...setters: Setter[]) {
    useEffect(() => {
        const timer = setTimeout(() => {
            setters.forEach((setActive) => setActive(false))
        }, 3000)

        return () => clearTimeout(timer)
    }, [setters])
}
