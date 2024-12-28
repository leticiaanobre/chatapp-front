import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL="http://localhost:5001"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false, 
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})

            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth: ", error)
            set({authUser: null})
        } finally {
            set({ isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            toast.success("Conta criada com sucesso")
            set({authUser: res.data}) //users authenticated as soon as they signup

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp: false})
        }
    },

    login: async (data) => {
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({authUser: res.data}) //because user has been authenticated
            toast.success("Login feito com sucesso")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn: false})
        }
    },

    logout: async () => {
        try {
            axiosInstance.post("/auth/logout")
            toast.success("Logout com sucesso")

            get.disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true})

        try {
            const res = await axiosInstance.post("/auth/update-profile", data)
            set({authUser: res.data})
            toast.success("Usuário editado com sucesso")
        } catch (error) {
            console.log("Error in updating profile: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        const{authUser} = get()

        if(!authUser || get().socket?.connected) return //if user is not authenticated or already connected, dont make the connection

        const socket = io(BASE_URL)
        socket.connect()
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
    }
}))