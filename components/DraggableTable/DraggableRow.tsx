"use client"
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Row } from "react-table";

export const DraggableRow: React.FC<{ row: Row, id: string | number }> = ({ row,id }) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        setNodeRef,
        isDragging
    } = useSortable({
        id: id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    };
    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...row.getRowProps()}
            className=" h-12"
        >
            {isDragging ? (
                <td
                    className="bg-blue-300 bg-opacity-30 border-gray-800 border-solid border-b"
                    colSpan={row.cells.length + 1}
                >

                </td>
            ) : (
                <>
                    <td
                        className={`  border-gray-800 border-solid border-b`}
                    >
                        <div
                            className="w-full h-full flex items-center justify-center p-4"
                            {...attributes}
                            {...listeners}
                        >
                            <span
                                className={`h-2 w-4 border-gray-800 border-solid hover:border-gray-600 border-b-2 border-t-2 p-0.5`}

                            />
                        </div>

                    </td>
                    {

                        row.cells.map((cell) => {
                            return (
                                <td
                                    className=" text-gray-500 w-[20ch] text-center border-gray-800 border-solid border-b min-w-[100px]"
                                    {...cell.getCellProps()}
                                    key={cell.getCellProps().key}
                                >
                                    {cell.render("Cell")}
                                </td>
                            );
                        })
                    }
                </>
            )}
        </tr>
    );
};