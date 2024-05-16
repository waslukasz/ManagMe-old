import { useEffect, useRef, useState } from "react";
import { Functionality as FunctionalityType } from "../../types/FunctionalityType";

import AcceptIcon from "../../assets/accept.svg";
import EditIcon from "../../assets/edit.svg";
import DeleteIcon from "../../assets/delete.svg";
import BackIcon from "../../assets/back.svg";
import FunctionalityApi from "../../api/FunctionalityApi";
import { Link } from "react-router-dom";
import { format as formatDate } from "date-fns";

export default function Functionality({
  data,
  updateState,
  updateHandler,
}: {
  data: FunctionalityType;
  updateState: any;
  updateHandler: any;
}) {
  const functionalityApi = new FunctionalityApi();
  const [currentFunctionality, setCurrentFunctionality] =
    useState<FunctionalityType>(data);
  const [functionalityData, setFunctionalityData] =
    useState<FunctionalityType>(currentFunctionality);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const editStyle = {
    filter:
      "invert(32%) sepia(72%) saturate(552%) hue-rotate(150deg) brightness(95%) contrast(85%)",
  };
  const deleteStyle = {
    filter:
      "invert(24%) sepia(30%) saturate(5752%) hue-rotate(346deg) brightness(94%) contrast(84%)",
  };
  const acceptStyle = {
    filter:
      "invert(33%) sepia(79%) saturate(618%) hue-rotate(78deg) brightness(105%) contrast(87%)",
  };
  const backStyle = {
    filter:
      "invert(32%) sepia(72%) saturate(552%) hue-rotate(150deg) brightness(95%) contrast(85%)",
  };

  const priorityRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {}, [updateState]);

  async function editHandler() {
    if (functionalityData.name == "") return;
    setIsEditing((prevState) => !prevState);
    if (!isEditing) return;
    setCurrentFunctionality(
      await functionalityApi.Update({
        ...functionalityData,
        priority: parseInt(priorityRef.current?.value!),
        status: parseInt(statusRef.current?.value!),
      })
    );
    updateHandler();
  }

  async function cancelEditHandler() {
    setFunctionalityData(currentFunctionality);
    setIsEditing((prevState) => !prevState);
    return;
  }

  async function deleteHandler() {
    await functionalityApi.Delete(currentFunctionality);
    setIsDeleted(true);
    updateHandler();
  }

  return (
    <>
      {!isDeleted && (
        <div className="inline-flex flex-col min-w-32 shadow border border-solid border-gray-100 p-3 rounded font-sans justify-between">
          <div className="flex items-baseline gap-0.5 rounded-full justify-end mb-2">
            {!isEditing && (
              <>
                <img
                  className="h-5 cursor-pointer"
                  style={editStyle}
                  src={EditIcon}
                  alt="Edit"
                  onClick={editHandler}
                />
                <img
                  className="h-5 cursor-pointer"
                  style={deleteStyle}
                  src={DeleteIcon}
                  alt="Delete"
                  onClick={deleteHandler}
                />
              </>
            )}

            {isEditing && (
              <>
                <img
                  className="h-5 cursor-pointer"
                  style={acceptStyle}
                  src={AcceptIcon}
                  alt="Accept"
                  onClick={editHandler}
                />
                <img
                  className="h-5 cursor-pointer"
                  style={backStyle}
                  src={BackIcon}
                  alt="Cancel"
                  onClick={cancelEditHandler}
                />
              </>
            )}
          </div>
          <hr />

          {!isEditing && (
            <>
              <div className="flex flex-col flex-grow">
                <div className="flex flex-col flex-grow">
                  <span className="text-xl font-bold">
                    {currentFunctionality.name}
                  </span>
                  <span className="text-sm mt-1">
                    {currentFunctionality.description}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex flex-col">
                  <span className="text-xs text-right italic mt-1">
                    Priority: {currentFunctionality.priority == 0 && <>Low</>}{" "}
                    {currentFunctionality.priority == 1 && <>Medium</>}
                    {currentFunctionality.priority == 2 && <>High</>}
                  </span>
                  <span className="text-xs text-right italic">
                    Status: {currentFunctionality.status == 0 && <>TODO</>}{" "}
                    {currentFunctionality.status == 1 && <>Doing</>}
                    {currentFunctionality.status == 2 && <>Done</>}
                  </span>
                  <span className="text-xs text-right italic">
                    {formatDate(
                      currentFunctionality.createdTimestamp,
                      "hh:mm:ss - dd MMMM yyyy"
                    )}
                  </span>
                  <Link
                    to={"/tasks/" + currentFunctionality.id}
                    className="inline-flex self-end text-sm hover:underline text-blue-400 cursor-pointer select-none"
                  >
                    Show tasks
                  </Link>
                </div>
              </div>
            </>
          )}

          {isEditing && (
            <>
              <div className="flex flex-col mt-2">
                <label className="text-sm font-bold">Functionality name</label>
                <input
                  value={functionalityData.name}
                  onChange={(event) =>
                    setFunctionalityData({
                      ...functionalityData,
                      name: event.target.value,
                    })
                  }
                  className="border border-solid focus:outline-none p-1 rounded"
                  type="text"
                />

                <label className="text-sm font-bold mt-2">Description</label>
                <textarea
                  value={functionalityData.description ?? ""}
                  onChange={(event) =>
                    setFunctionalityData({
                      ...functionalityData,
                      description: event.target.value,
                    })
                  }
                  className="border border-solid focus:outline-none p-1 rounded"
                />

                <label className="text-sm font-bold mt-2">Priority</label>
                <select
                  ref={priorityRef}
                  defaultValue={currentFunctionality.priority}
                  className="rounded border border-solid border-black"
                >
                  <option value="0">Low</option>
                  <option value="1">Medium</option>
                  <option value="2">High</option>
                </select>

                <label className="text-sm font-bold mt-2">Status:</label>
                <select
                  ref={statusRef}
                  defaultValue={currentFunctionality.status}
                  name="status"
                  className="rounded border border-solid border-black"
                >
                  <option value="0">TODO</option>
                  <option value="1">Doing</option>
                  <option value="2">Done</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
