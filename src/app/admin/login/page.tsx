import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-4xl font-extrabold">Admin sign in</h1>
      <p className="mb-8 mt-2 text-mute">Only the site owner can add or change projects.</p>
      <LoginForm />
    </main>
  );
}
