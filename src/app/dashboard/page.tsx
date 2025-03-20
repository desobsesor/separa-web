import GridLayout from '@/components/ui/GridLayout';
import NewBlockForm from '@/components/dashboard/NewBlockForm';
import NewUserForm from '@/components/dashboard/NewUserForm';
import TimelineBar from '@/components/dashboard/TimelineBar';
import UserTable from '@/components/dashboard/UserTable';

export default function GridExample() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 px-2 sm:px-4 lg:px-6 w-full">
            <div className="w-full mx-auto max-w-screen-2xl">
                <GridLayout
                    header={<div className="h-20 items-center justify-center">
                        <div className="grid flex-col items-center text-center">
                            <h1 className="flex mt-6 text-4xl font-bold title-separa dark:text-white">
                                Separa App
                            </h1>
                            <p className="flex-col text-xl -mt-8 subtitle-separa text-gray-600 dark:text-gray-300">
                                Una aplicación moderna para la reserva de espacios
                            </p>
                        </div>
                    </div>}
                    leftSidebar={<div className="h-[90%] flex flex-col">
                        <TimelineBar />
                    </div>}
                    content={<div className="h-[90%] p-4">
                        <UserTable />
                    </div>}
                    rightSidebar={<div className="h-[90%] flex-col justify-center">
                        <NewUserForm />
                        <NewBlockForm />
                    </div>}
                />
            </div>
        </div>
    );
}