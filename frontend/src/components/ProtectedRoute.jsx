import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    //Check authorization when component mounts.
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            //POST request to backend to refresh access token.
            const res = await api.post("/api/token/refresh/",
                {
                    refresh: refreshToken,
                }
            )

            //If request is successful, store the new access token whilst setting isAuthorized to true.
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            setIsAuthorized(false)
            console.log(error)
        }
    }

    //Check if token refresh is needed via access token expiration.
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }

        //Decode token to retrieve token expiration time.
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp


        //Check for token expiration.
        if (tokenExpiration < (Date.now() / 1000)) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    //Redirect user to login page if access is not authorized.
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute