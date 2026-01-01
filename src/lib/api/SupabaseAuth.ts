// @sito/dashboard-app
import type { AuthDto, RegisterDto, SessionDto } from "@sito/dashboard-app"

import { supabase } from "./supabaseClient"
import { config } from "../../config"

export class SupabaseAuth {
  async login(data: AuthDto): Promise<SessionDto> {
    const { email, password } = data as unknown as { email: string; password: string }
    const { data: sessionData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(String(error.status ?? 500))
    const token = sessionData?.session?.access_token ?? ""
    const user = sessionData?.user ?? sessionData?.session?.user
    const session: any = {
      token,
      email: user?.email ?? email,
      id: (user as any)?.id ?? 0,
      username: (user as any)?.user_metadata?.username ?? (user?.email ? String(user.email).split("@")[0] : ""),
    }
    return session as SessionDto
  }

  async register(data: RegisterDto): Promise<SessionDto> {
    const { email, password } = data as unknown as { email: string; password: string }
    const { data: sessionData, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(String(error.status ?? 500))
    const token = sessionData?.session?.access_token ?? ""
    const user = sessionData?.user ?? sessionData?.session?.user
    const session: any = {
      token,
      email: user?.email ?? email,
      id: (user as any)?.id ?? 0,
      username: (user as any)?.user_metadata?.username ?? (email ? String(email).split("@")[0] : ""),
    }
    return session as SessionDto
  }

  async getSession(): Promise<SessionDto> {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(String(error.status ?? 500))
    const token = data?.session?.access_token ?? ""
    const user = data?.session?.user
    const session: any = {
      token,
      email: user?.email ?? "",
      id: (user as any)?.id ?? 0,
      username: (user as any)?.user_metadata?.username ?? (user?.email ? String(user.email).split("@")[0] : ""),
    }
    return session as SessionDto
  }

  async logout(): Promise<number> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(String(error.status ?? 500))
    return 1
  }

  async recovery(email: string): Promise<number> {
    const redirectTo = `${String(config.thisUrl)}/auth/update-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) throw new Error(String(error.status ?? 500))
    return 1
  }

  async updatePassword(password: string): Promise<number> {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(String(error.status ?? 500))
    return 1
  }
}

