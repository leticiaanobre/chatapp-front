import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false, 

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})
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
    }
}))