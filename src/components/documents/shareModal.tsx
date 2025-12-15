import React, { useState } from "react";
import { X, Link, XIcon, ArrowLeft, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";
import { useGetUserInfinite } from "@/hooks/api/useSmartUserQuery";
import { DocumentSharePayload } from "@/types/documents";
import { useParams } from "next/navigation";
import { useShareDocumentMutation } from "@/hooks/api/useDocumentQuery";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SelectedUser extends User {
  role: "viewer" | "commenter" | "editor";
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSuccess: () => void;
}

// Avatar colors array
const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

// Function to get consistent color for a user
const getAvatarColor = (userId: string): string => {
  // Create a simple hash from the GUID string
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Get absolute value and map to color array index
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

const ShareModal = ({
  isOpen,
  onClose,
  title,
}: ShareModalProps) => {
  const params = useParams();
  const { id } = params;
  const [step, setStep] = useState<"initial" | "sharing">("initial");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [storedSelectedUsers, setStoredSelectedUsers] = useState<
    SelectedUser[]
  >([]);
  const [message, setMessage] = useState("");
  //   const [notifyPeople, setNotifyPeople] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  //   const currentUser = {
  //     name: "Jude Biose",
  //     email: "judebiose20@gmail.com",
  //   };

  const { data: userData } = useGetUserInfinite(searchQuery);

  // share document mutation
  const shareDocuments = useShareDocumentMutation(id as string);

  // searchResults
  const userOptions = React.useMemo(() => {
    return (
      userData?.pages
        ?.flatMap((p) => p.data)
        .map((u) => ({
          name: u.firstName + " " + u.lastName,
          id: u.id,
          email: u.email,
        })) ?? []
    );
  }, [userData, searchQuery]);

  // Check if user already exists in selected or stored users
  const isUserAlreadySelected = (userId: string): boolean => {
    const inSelected = selectedUsers.some((u) => u.id === userId);
    const inStored = storedSelectedUsers.some((u) => u.id === userId);
    return inSelected || inStored;
  };

  const handleSearchQuery = (value: string) => {
    setSearchQuery(value);
    setIsTyping(true);
  };

  const handleAddUser = (
    user: User,
    role: "editor" | "viewer" | "commenter" = "viewer"
  ) => {
    // Check if user already exists
    if (isUserAlreadySelected(user.id)) {
      toast.warning("User already added", {
        unstyled: false,
        position: "top-right",
        classNames: {
          toast:
            "capitalize bg-yellow-50 z-50 flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
          title: "text-yellow-800",
        },
      });
      setSearchQuery("");
      setIsTyping(false);
      return;
    }

    setSelectedUsers([...selectedUsers, { ...user, role }]);
    setSearchQuery("");
    setIsTyping(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Delete last badge when backspace is pressed and input is empty
    if (
      e.key === "Backspace" &&
      searchQuery === "" &&
      selectedUsers.length > 0
    ) {
      e.preventDefault();
      setSelectedUsers(selectedUsers.slice(0, -1));
    }
  };

  const handleStepBack = () => {
    if (selectedUsers.length === 0) {
      return setStep("initial");
    }

    setSelectedUsers([]);
    return setStep("initial");
  };

  const handleRoleChange = (
    userId: string,
    role: "viewer" | "commenter" | "editor"
  ) => {
    setSelectedUsers(
      selectedUsers.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const handleSend = () => {
    setLoader(true);
    // Prepare data to send to backend
    const shareData: DocumentSharePayload = {
      //   documentId: params?.id as string,
      shareWithEmail: selectedUsers.map((u) => u.email),
      permission: "viewer",
      message,
      //   notifyPeople,
    };

    shareDocuments.mutate(shareData, {
      onSuccess: () => {
        // Reset and close
        setLoader(true);
        setStep("initial");
        setSelectedUsers([]);

        // Only add unique users to stored list
        setStoredSelectedUsers((prev) => {
          const combined = [...prev, ...selectedUsers];
          // Filter to keep only unique users based on ID
          const unique = combined.filter(
            (user, index, self) =>
              index === self.findIndex((u) => u.id === user.id)
          );
          return unique;
        });

        setMessage("");
        toast.success("Document shared successfully", {
          unstyled: false,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-white z-50 flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
            title: "text-primary-gray",
          },
        });
      },
      onError: (error) => {
        setLoader(false);
        toast.error(
          error instanceof AxiosError
            ? error?.response?.data?.message
            : "Failed to share document",
          {
            unstyled: true,
            position: "top-right",
            classNames: {
              toast:
                "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
              title: "text-[#E71D36]",
            },
          }
        );
      },
    });
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(`${origin}/documents/${params.id}/view`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Initial view
  if (step === "initial") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className={cn(`max-w-lg p-0 font-[family-name:var(--font-dm)]`)}
        >
          <DialogHeader className="flex flex-row items-center justify-between px-6 py-4">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </DialogHeader>
          {/* Header */}
          <div
            className="absolute top-5 right-5 flex justify-center items-center h-[20px] w-[20px] bg-[#0284B21A] rounded-full cursor-pointer"
            onClick={onClose}
          >
            <XIcon className="w-[15px] h-[15px]" color="#0284B2" />
          </div>

          {/* Search Input */}
          <div className="px-6">
            <div className="relative">
              <label className="font-semibold text-[15px]">
                Share Document with
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchQuery(e.target.value)}
                onFocus={() => selectedUsers.length > 0 && setStep("sharing")}
                placeholder=""
                className="w-full px-4 py-3 border-1 border-[#CCCCCCCC] rounded focus:outline-none focus:border-[#CCCCCCCC]"
              />

              {/* Search Results Dropdown */}
              {isTyping && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-50 overflow-y-auto z-10">
                  {userOptions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        handleAddUser(user);
                        setStep("sharing");
                      }}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                    >
                      <div
                        className={`w-10 h-10 ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white font-medium`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* People with access */}
          <div className="px-6 pb-4">
            <h3 className="text-[15px] font-semibold text-primary-gray mb-2">
              Shared With
            </h3>
            {/* <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JB</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {currentUser.name}
                </div>
                <div className="text-sm text-gray-600">{currentUser.email}</div>
              </div>
              <div className="text-gray-500 text-sm">Viewer</div>
            </div> */}

            {storedSelectedUsers.length > 0 && (
              <>
                {storedSelectedUsers?.map((user) => {
                  return (
                    <div className="flex items-center gap-3 mb-3" key={user.id}>
                      <div
                        className={`w-10 h-10 ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white text-xs font-medium`}
                      >
                        <span className="text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">{user.role}</div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="relative flex items-center justify-between px-6 pb-6">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-[8px] hover:bg-gray-50 font-medium text-gray-700"
            >
              <Link className="w-4 h-4" />
              Copy link
            </button>
            <button
              className="px-8 py-2 bg-brand-blue text-white rounded-[8px] hover:bg-brand-blue font-medium"
              onClick={onClose}
            >
              Done
            </button>

            {isCopied && (
              <span className="absolute bg-black rounded-md text-white px-3 py-1 left-[10%] -top-7">
                Copied!
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Sharing view with selected users
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={handleStepBack}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h2 className="text-[18px] font-semibold text-primary-gray">
              {title}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {/* Selected Users as Badges with Search Input */}
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-4 border-1 border-gray-200 rounded min-h-[60px] focus-within:border-brand-blue">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full pl-2 pr-3 py-1 h-8"
                >
                  <div
                    className={`w-6 h-6 ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white text-xs font-medium`}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user.name}
                  </span>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedUsers.length === 0 ? "Add people" : ""}
                className="flex-1 min-w-[200px] px-2 py-1 outline-none"
              />
            </div>

            {/* Search Results Dropdown */}
            {isTyping && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {userOptions.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddUser(user)}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                  >
                    <div
                      className={`w-10 h-10 ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white font-medium`}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Selector */}
          <div className="flex flex-col justify-start w-full my-4">
            <label className="text-[15px] font-semibold">Permissions</label>
            <select
              disabled
              value={selectedUsers[0]?.role || "viewer"}
              onChange={(e) => {
                const newRole = e.target.value as
                  | "viewer"
                  | "commenter"
                  | "editor";
                selectedUsers.forEach((user) =>
                  handleRoleChange(user.id, newRole)
                );
              }}
              className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="viewer">Viewer</option>
              {/* <option value="commenter">Commenter</option>
              <option value="editor">Editor</option> */}
            </select>
          </div>

          {/* Message Box */}
          <div className="mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              rows={6}
              className="w-full px-4 py-3 border-1 border-gray-300 rounded resize-none focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Footer */}
          <div className="relative flex items-center justify-between">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={handleCopyLink}
            >
              <Link className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setStep("initial");
                  setSelectedUsers([]);
                  setMessage("");
                }}
                className="px-6 py-2 text-brand-blue hover:bg-blue-50 rounded-full font-medium cursor-pointer"
              >
                Cancel
              </button>
              <Button
                onClick={handleSend}
                disabled={selectedUsers.length === 0 || loader}
                className="px-8 py-2 bg-brand-blue cursor-pointer text-white rounded-full hover:bg-brand-blue hover:shadow-md font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loader && <Loader2 className="animate-spin" />}
                Send
              </Button>
            </div>

            {isCopied && (
              <span className="absolute bg-black rounded-md text-white px-3 py-1 left-[10%] -top-7">
                Link Copied!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
