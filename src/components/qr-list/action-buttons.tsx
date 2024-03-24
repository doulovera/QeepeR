import { Delete } from "../icons/delete"
import { Download } from "../icons/download"
import { Share } from "../icons/share"

export const ActionButtons = (
  { handleDelete }:
  {
    handleDelete: () => void;
  }
) => (
  <div className="flex justify-between gap-2">
    <button
      className="flex items-center justify-center gap-2 w-full h-14 rounded-[2.5px] bg-primary-950"
      onClick={handleDelete}
    >
      <Delete width="20" color="#fff" />
      Delete
    </button>
    <button className="flex items-center justify-center gap-2 w-full h-14 rounded-[2.5px] bg-primary-950">
      <Download width="20" color="#fff" />
      Download
    </button>
    <button className="flex items-center justify-center gap-2 w-full h-14 rounded-[2.5px] bg-primary-950">
      <Share width="20" color="#fff" />
      Share
    </button>
  </div>
)