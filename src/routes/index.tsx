import { Button, Card } from "@heroui/react";
import { useCallback, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

const INPUT_CLASS =
  "rounded-lg border border-default-300 bg-default-100 px-3 py-2 text-default-900";

function LoadingView() {
  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-900 to-slate-800">
      <p className="text-white">読み込み中...</p>
    </main>
  );
}

function LoggedInView({ displayName, onSignOut }: { displayName: string; onSignOut: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-center">ようこそ！</h1>
          <p className="text-default-500 text-center">{displayName} としてログイン中</p>
          <Button variant="secondary" onPress={onSignOut}>
            サインアウト
          </Button>
        </div>
      </Card>
    </main>
  );
}

interface AuthParams {
  email: string;
  isSignUp: boolean;
  name: string;
  password: string;
}

async function submitAuth(params: AuthParams): Promise<string> {
  const { email, isSignUp, name, password } = params;
  if (isSignUp) {
    const result = await authClient.signUp.email({ email, name, password });
    if (result.error) {
      return result.error.message ?? "サインアップに失敗しました";
    }
  } else {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      return result.error.message ?? "サインインに失敗しました";
    }
  }
  return "";
}

function useAuthForm(isSignUp: boolean) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value),
    [],
  );
  const handlePasswordChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value),
    [],
  );
  const handleNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => setName(ev.target.value),
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
      const errorMessage = await submitAuth({ email, isSignUp, name, password });
      setError(errorMessage);
      setLoading(false);
    },
    [email, isSignUp, name, password],
  );

  return {
    email,
    error,
    handleEmailChange,
    handleNameChange,
    handlePasswordChange,
    handleSubmit,
    loading,
    name,
    password,
  };
}

function SignUpForm({ isSignUp }: { isSignUp: boolean }) {
  if (!isSignUp) {
    return null;
  }
  return <p className="text-sm text-default-500">名前を入力してアカウントを作成</p>;
}

function NameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="name" className="text-sm text-default-500">
        名前
      </label>
      <input
        id="name"
        type="text"
        placeholder="山田 太郎"
        value={value}
        onChange={onChange}
        className={INPUT_CLASS}
      />
    </div>
  );
}

function EmailInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="email" className="text-sm text-default-500">
        メールアドレス
      </label>
      <input
        id="email"
        type="email"
        placeholder="example@email.com"
        value={value}
        onChange={onChange}
        required
        className={INPUT_CLASS}
      />
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="password" className="text-sm text-default-500">
        パスワード
      </label>
      <input
        id="password"
        type="password"
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        required
        className={INPUT_CLASS}
      />
    </div>
  );
}

function AuthFormFields({
  isSignUp,
  formState,
}: {
  isSignUp: boolean;
  formState: ReturnType<typeof useAuthForm>;
}) {
  return (
    <>
      {isSignUp && <NameInput value={formState.name} onChange={formState.handleNameChange} />}
      <EmailInput value={formState.email} onChange={formState.handleEmailChange} />
      <PasswordInput value={formState.password} onChange={formState.handlePasswordChange} />
    </>
  );
}

function getAuthLabels(isSignUp: boolean) {
  if (isSignUp) {
    return {
      submitLabel: "アカウント作成",
      title: "アカウント作成",
      toggleLabel: "既にアカウントをお持ちの方はこちら",
    };
  }
  return {
    submitLabel: "サインイン",
    title: "サインイン",
    toggleLabel: "アカウントを作成する",
  };
}

function getButtonLabel(loading: boolean, submitLabel: string) {
  if (loading) {
    return "処理中...";
  }
  return submitLabel;
}

function AuthForm({ isSignUp, onToggleMode }: { isSignUp: boolean; onToggleMode: () => void }) {
  const formState = useAuthForm(isSignUp);
  const labels = getAuthLabels(isSignUp);
  const buttonLabel = getButtonLabel(formState.loading, labels.submitLabel);

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-center">{labels.title}</h1>
          <SignUpForm isSignUp={isSignUp} />

          <form onSubmit={formState.handleSubmit} className="flex flex-col gap-4">
            <AuthFormFields isSignUp={isSignUp} formState={formState} />

            {formState.error && (
              <p className="text-red-500 text-sm text-center">{formState.error}</p>
            )}

            <Button type="submit" variant="primary" isDisabled={formState.loading}>
              {buttonLabel}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-blue-400 hover:underline"
            >
              {labels.toggleLabel}
            </button>
          </div>
        </div>
      </Card>
    </main>
  );
}

function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignOut = useCallback(async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          location.reload();
        },
      },
    });
  }, []);

  const handleToggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
  }, []);

  if (isPending) {
    return <LoadingView />;
  }

  if (session) {
    const displayName = session.user.name || session.user.email;
    return <LoggedInView displayName={displayName} onSignOut={handleSignOut} />;
  }

  return <AuthForm isSignUp={isSignUp} onToggleMode={handleToggleMode} />;
}
