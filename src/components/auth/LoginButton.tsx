import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("fitbit")
      }}
    >
      <button type="submit">Signin with Fitbit</button>
    </form>
  )
} 