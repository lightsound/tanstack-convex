import { Button, Card, Chip } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <Chip color="accent" variant="soft">
            HeroUI v3
          </Chip>
          <h1 className="text-4xl font-bold text-center">Hello World!</h1>
          <p className="text-default-500 text-center">HeroUI v3 が正常に動作しています 🎉</p>
          <div className="flex gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
