import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";

export default function Kanban({ session }) {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

	useEffect(() => {
		async function getColumns() {
			setLoading(true);
			let { data, error } = await supabase.from("columns").select("*");

			if (error) {
				console.warn(error);
			} else if (data) {
				setColumns(data);
			}

			setLoading(false);
		}

		getColumns();
  }, [session]);

  return (
    <>
      <header className="p-2 flex justify-end bg-blue-100 shadow-md">
        <button
				className="bg-red-400 text-white rounded-md p-2"
				type="button"
				onClick={() => supabase.auth.signOut()}
        >
			Sign Out
        </button>
      </header>
      <main className="mx-4 lg:mx-52 mt-20 h-full">
			<DndProvider backend={HTML5Backend}>
				<div className="flex space-x-10">
					{!loading && columns.map((column, index) => {
						return (<Column
									key={column.id}
									column={column}
									size={columns.length}
									session={session}
									index={index}
								/>);
					})}
				</div>
			</DndProvider>
      </main>
    </>
  );
}
