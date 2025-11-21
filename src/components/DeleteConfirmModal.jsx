import Modal from "./Modal";

const DeleteConfirmModal = ({ openModal, handleModalClose, handleDelete }) => {
  return (
    openModal && (
      <Modal
        openModal={openModal}
        handleModalClose={handleModalClose}
        className="w-full max-w-md h-[300px] px-8 py-6 mt-4 text-left bg-zinc-800 shadow-2xl rounded-lg border border-zinc-700"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex-1 flex items-center justify-center">
            이 게시물을 정말 삭제하시겠습니까?
          </div>
          <div className="flex gap-4 items-end">
            <button
              className="w-full px-6 py-2 mt-4 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
              onClick={handleDelete}
            >
              삭제하기
            </button>
            <button
              className="w-full px-6 py-2 mt-4 text-white bg-zinc-600 rounded-lg hover:bg-zinc-500 transition-colors"
              onClick={handleModalClose}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    )
  );
};

export default DeleteConfirmModal;
