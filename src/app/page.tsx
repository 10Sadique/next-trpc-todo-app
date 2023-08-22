import { TodoList } from "@/components/todo-list";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const todos = await serverClient.getTodos();
  return (
    <main className="container">
      <div className="flex flex-col items-center mt-24 justify-center">
        <h1 className="mb-6 text-4xl font-black">tRPC Todo App</h1>
        <TodoList initialTodos={todos} />
      </div>
    </main>
  );
}
