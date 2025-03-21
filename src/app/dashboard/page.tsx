import GridLayout from '@/components/ui/GridLayout';
import NewBlockForm from '@/components/dashboard/NewBlockForm';
import NewUserForm from '@/components/dashboard/NewUserForm';
import TimelineBar from '@/components/dashboard/TimelineBar';
import UserTable from '@/components/dashboard/UserTable';

export default function GridExample() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 px-2 sm:px-4 lg:px-6 w-full">
            <div className="w-full mx-auto max-w-screen-2xl mt-4">
                <GridLayout
                    header={<div className="h-auto items-center justify-center">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
                            <h1 className="text-4xl font-bold title-separa dark:text-white">
                                Separa App
                            </h1>
                            <p className="text-xl subtitle-separa text-gray-600 dark:text-gray-300 md:mt-0">
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