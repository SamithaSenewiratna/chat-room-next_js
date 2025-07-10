"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogClose,
} from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hook/useMutationState";
import { useUser } from "@clerk/nextjs"; // ✅ Clerk hook

const addMemberFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email format"),
});

type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;

const AddMemberDialog: React.FC = () => {
  const { user, isLoaded } = useUser(); // ✅ Ensure `isLoaded`
  const [selfError, setSelfError] = useState("");

  const { mutate: createRequest, pending } = useMutationState(api.request.create);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: AddMemberFormValues) => {
    // Guard: wait for Clerk user to load
    if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) {
      setSelfError("User data not loaded. Please wait.");
      return;
    }

    const currentEmail = user.primaryEmailAddress.emailAddress.toLowerCase().trim();
    const inputEmail = data.email.toLowerCase().trim();

    // Self-check
    if (inputEmail === currentEmail) {
      setSelfError("You cannot send a request to yourself.");
      return;
    }

    setSelfError(""); // Clear previous error
    createRequest({ email: inputEmail });
    reset();
  };

  return (
    <Dialog>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" className="m-3" variant="outline">
              <UserPlus />
            </Button>
          </DialogTrigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700"
          side="right"
          sideOffset={5}
        >
          <Tooltip.Arrow />
          Add Member
        </Tooltip.Content>
      </Tooltip.Root>

      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg focus:outline-none">
        <DialogHeader>
          <DialogTitle>Add a New Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
            {selfError && (
              <p className="text-sm text-red-600">{selfError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" onClick={() => reset()}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending || !isLoaded}>
              {pending ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
