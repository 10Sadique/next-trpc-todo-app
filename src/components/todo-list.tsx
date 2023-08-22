"use client";

import { FormEvent, useState } from "react";
import { Check, RotateCw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { serverClient } from "@/app/_trpc/serverClient";

export const TodoList = ({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}) => {
  const [content, setContent] = useState("");

  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const setDone = trpc.setDone.useMutation({
    onSettled: () => getTodos.refetch(),
  });

  const deleteTodo = trpc.deleteTodo.useMutation({
    onSettled: () => getTodos.refetch(),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content.length) {
      addTodo.mutate(content);
      setContent("");
    }
  };

  return (
    <div className="w-[600px]">
      <form
        onSubmit={handleSubmit}
        className="mb-10 flex items-center space-x-4"
      >
        <Input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-2/3"
        />
        <Button type="submit" className="flex-1 font-semibold">
          Add Todo
        </Button>
      </form>

      <div className="space-y-3">
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p
                className={cn(
                  "text-3xl font-bold",
                  todo.done && "line-through"
                )}
              >
                {todo.content}
              </p>
            </div>

            <div className="space-x-4">
              <Button
                variant={"secondary"}
                size={"sm"}
                onClick={async () => {
                  setDone.mutate({ id: todo.id, done: todo.done ? 0 : 1 });
                }}
              >
                {todo.done ? (
                  <RotateCw className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={async () => {
                  deleteTodo.mutate({ id: todo.id });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
