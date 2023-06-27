import Layout from "~/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Tareas() {
  return (
    <Layout>
      <div className="flex h-full flex-col items-center bg-[#E9E9E9] p-5">
        <Tabs defaultValue="tareas" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="tareas">Tareas</TabsTrigger>
              <TabsTrigger value="rutinas">Rutinas</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="tareas">
            <div className="flex flex-col">
              <h2 className="my-5 font-medium">Tareas pendientes de hoy</h2>
              <div className="bg-[#D9D9D9]"></div>
            </div>
          </TabsContent>
          <TabsContent value="rutinas">
            <div className="flex flex-col">
              <h2 className="my-5 font-medium">Tus rutinas</h2>
              <div className="bg-[#D9D9D9]"></div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
