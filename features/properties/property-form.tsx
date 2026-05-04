"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { ActionFeedback } from "@/components/shared/action-feedback";
import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  operationTypeLabels,
  propertyStatusLabels,
  propertyTypeLabels,
} from "@/lib/ui-labels";

interface PropertyFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues?: Partial<Tables<"properties">>;
}

export function PropertyForm({ action, initialValues }: PropertyFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos comerciales</CardTitle>
          <CardDescription>
            Información mínima para identificar y publicar la propiedad.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            htmlFor="title"
            label="Título"
            error={state.fieldErrors?.title?.[0]}
            description="Nombre visible en listados, conversaciones y fichas internas."
            className="md:col-span-2"
          >
            <Input
              defaultValue={initialValues?.title ?? ""}
              id="title"
              name="title"
              required
            />
          </FormField>
          <FormField
            htmlFor="external_ref"
            label="Referencia externa"
            description="Código interno, CRM externo o identificador comercial."
          >
            <Input
              defaultValue={initialValues?.external_ref ?? ""}
              id="external_ref"
              name="external_ref"
            />
          </FormField>
          <FormField
            htmlFor="status"
            label="Estado"
            description="Define si la propiedad puede usarse comercialmente."
          >
            <NativeSelect
              defaultValue={initialValues?.status ?? "draft"}
              id="status"
              name="status"
            >
              {Object.entries(propertyStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField
            htmlFor="operation_type"
            label="Operación"
            description="Tipo de búsqueda que debe matchear con leads."
          >
            <NativeSelect
              defaultValue={initialValues?.operation_type ?? "sale"}
              id="operation_type"
              name="operation_type"
            >
              {Object.entries(operationTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField htmlFor="property_type" label="Tipo">
            <NativeSelect
              defaultValue={initialValues?.property_type ?? "apartment"}
              id="property_type"
              name="property_type"
            >
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Precio</CardTitle>
          <CardDescription>
            Valores comerciales usados para calificar consultas y presupuestos.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <FormField htmlFor="price" label="Precio principal">
            <Input
              defaultValue={initialValues?.price ?? ""}
              id="price"
              name="price"
              type="number"
            />
          </FormField>
          <FormField
            htmlFor="currency"
            label="Moneda"
            description="Código de moneda, por ejemplo PYG o USD."
          >
            <Input
              defaultValue={initialValues?.currency ?? "PYG"}
              id="currency"
              name="currency"
            />
          </FormField>
          <FormField
            htmlFor="expenses_amount"
            label="Expensas"
            description="Completá solo si aplica."
          >
            <Input
              defaultValue={initialValues?.expenses_amount ?? ""}
              id="expenses_amount"
              name="expenses_amount"
              type="number"
            />
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
          <CardDescription>
            Datos usados para búsquedas, filtros y contexto conversacional.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormField
            htmlFor="location_text"
            label="Ubicación resumida"
            description="Texto corto para mostrar en fichas y respuestas."
            className="md:col-span-2"
          >
            <Input
              defaultValue={initialValues?.location_text ?? ""}
              id="location_text"
              name="location_text"
            />
          </FormField>
          <FormField htmlFor="city" label="Ciudad">
            <Input
              defaultValue={initialValues?.city ?? ""}
              id="city"
              name="city"
            />
          </FormField>
          <FormField htmlFor="neighborhood" label="Barrio">
            <Input
              defaultValue={initialValues?.neighborhood ?? ""}
              id="neighborhood"
              name="neighborhood"
            />
          </FormField>
          <FormField
            htmlFor="address"
            label="Dirección"
            description="Uso interno. Evitá cargar detalles sensibles si no corresponde."
            className="md:col-span-2"
          >
            <Input
              defaultValue={initialValues?.address ?? ""}
              id="address"
              name="address"
            />
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
          <CardDescription>
            Datos estructurados para comparar propiedades y responder consultas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <FormField htmlFor="bedrooms" label="Dormitorios">
            <Input
              defaultValue={initialValues?.bedrooms ?? ""}
              id="bedrooms"
              name="bedrooms"
              type="number"
            />
          </FormField>
          <FormField htmlFor="bathrooms" label="Baños">
            <Input
              defaultValue={initialValues?.bathrooms ?? ""}
              id="bathrooms"
              name="bathrooms"
              type="number"
            />
          </FormField>
          <FormField htmlFor="garages" label="Cocheras">
            <Input
              defaultValue={initialValues?.garages ?? ""}
              id="garages"
              name="garages"
              type="number"
            />
          </FormField>
          <FormField htmlFor="area_m2" label="Superficie construida m²">
            <Input
              defaultValue={initialValues?.area_m2 ?? ""}
              id="area_m2"
              name="area_m2"
              type="number"
            />
          </FormField>
          <FormField htmlFor="lot_area_m2" label="Terreno m²">
            <Input
              defaultValue={initialValues?.lot_area_m2 ?? ""}
              id="lot_area_m2"
              name="lot_area_m2"
              type="number"
            />
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Descripción y atributos</CardTitle>
          <CardDescription>
            Texto comercial y señales rápidas para consultas frecuentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField
            htmlFor="description"
            label="Descripción"
            description="Resumen comercial. Mantené detalles internos fuera de este texto."
          >
            <Textarea
              className="min-h-32"
              defaultValue={initialValues?.description ?? ""}
              id="description"
              name="description"
            />
          </FormField>
          <div className="border-border bg-lightprimary space-y-3 rounded-xl border p-5">
            <p className="text-foreground text-sm font-medium">
              Atributos destacados
            </p>
            <p className="text-muted-foreground text-xs">
              Seleccioná solo los atributos que quieras usar como señales
              rápidas en atención comercial.
            </p>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.pets_allowed ?? false}
                  name="pets_allowed"
                  type="checkbox"
                />
                Acepta mascotas
              </label>
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.furnished ?? false}
                  name="furnished"
                  type="checkbox"
                />
                Amoblada
              </label>
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.has_pool ?? false}
                  name="has_pool"
                  type="checkbox"
                />
                Piscina
              </label>
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.has_garden ?? false}
                  name="has_garden"
                  type="checkbox"
                />
                Jardín
              </label>
              <label className="border-border bg-card text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  defaultChecked={initialValues?.has_balcony ?? false}
                  name="has_balcony"
                  type="checkbox"
                />
                Balcón
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      {state.message ? (
        <ActionFeedback message={state.message} status={state.status} />
      ) : null}
      <div className="flex justify-end">
        <SubmitButton
          label="Guardar propiedad"
          pendingLabel="Guardando propiedad..."
          shape="pill"
        />
      </div>
    </form>
  );
}
