'use client';

import { api } from "~/trpc/react";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";
import useConversation from "~/server/helpers/useConversation";

import Modal from "~/app/_components/Modal";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi"
import Button from "~/app/_components/inputs/Button";


interface ConfirmModalProps {
  isOpen: boolean,
  onClose: () => void, 
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen, onClose, 
}) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [ isLoading, setIsLoading ] = useState(false);
  const deleteConversation = api.conversation.deleteMessage.useMutation()

  const onDelete = useCallback(async()=>{
    setIsLoading(true);

    try {
        await deleteConversation.mutateAsync({conversationId});
        router.push('/conversations');
        router.refresh();
        setIsLoading(false);
    } catch (error) {
        console.log(error, 'ERROR')
    }

  }, [conversationId, deleteConversation, router])


  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="sm:flex sm:items-start ">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 justify-center items-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle 
            className="h-6 w06 text-red-600"
          />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left ">
          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900" >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
                Are you sure you want delete the conversation? This action cannot be undone. 
            </p>
          </div>
        </div>
      </div> 
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse ">
        <Button
          disabled={isLoading}
          danger
          onClick={onDelete}
        >
            Delete
        </Button>
        <Button
          disabled={isLoading} 
          secondary
          onClick={onClose}
        >
            Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal;