"use client";

import { useActionState } from "react";
import type { Tables } from "@/types/database";

import { INITIAL_ACTION_STATE, type ActionState } from "@/types/actions";

import { FormField } from "@/components/shared/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PropertyFormProps {
	action: (state: ActionState, formData: FormData) => Promise<ActionState>;
	initialValues?: Partial<Tables<"properties">>;
}

export function PropertyForm({ action, initialValues }: PropertyFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

	return (
		<form action={formAction} className="space-y-6">
			<Card>
				<CardContent className="grid gap-4 pt-6 md:grid-cols-2">
					<FormField
						htmlFor="title"
						label="Título"
						error={state.fieldErrors?.title?.[0]}
						className="md:col-span-2"
					>
						<Input defaultValue={initialValues?.title ?? ""} id="title" name="title" required />
					</FormField>
					<FormField htmlFor="external_ref" label="Referencia externa">
						<Input
							defaultValue={initialValues?.external_ref ?? ""}
							id="external_ref"
							name="external_ref"
						/>
					</FormField>
					<FormField htmlFor="status" label="Estado">
						<Select defaultValue={initialValues?.status ?? "draft"} id="status" name="status">
							<option value="draft">Borrador</option>
							<option value="available">Disponible</option>
							<option value="reserved">Reservada</option>
							<option value="rented">Alquilada</option>
							<option value="sold">Vendida</option>
							<option value="inactive">Inactiva</option>
						</Select>
					</FormField>
					<FormField htmlFor="operation_type" label="Operación">
						<Select
							defaultValue={initialValues?.operation_type ?? "sale"}
							id="operation_type"
							name="operation_type"
						>
							<option value="sale">Venta</option>
							<option value="rent">Alquiler</option>
						</Select>
					</FormField>
					<FormField htmlFor="property_type" label="Tipo">
						<Select
							defaultValue={initialValues?.property_type ?? "apartment"}
							id="property_type"
							name="property_type"
						>
							<option value="apartment">Departamento</option>
							<option value="house">Casa</option>
							<option value="land">Terreno</option>
							<option value="office">Oficina</option>
							<option value="commercial">Local comercial</option>
							<option value="warehouse">Depósito</option>
							<option value="duplex">Dúplex</option>
							<option value="condo">Condominio</option>
							<option value="other">Otro</option>
						</Select>
					</FormField>
					<FormField htmlFor="price" label="Precio">
						<Input defaultValue={initialValues?.price ?? ""} id="price" name="price" type="number" />
					</FormField>
					<FormField htmlFor="currency" label="Moneda">
						<Input defaultValue={initialValues?.currency ?? "PYG"} id="currency" name="currency" />
					</FormField>
					<FormField htmlFor="expenses_amount" label="Expensas">
						<Input
							defaultValue={initialValues?.expenses_amount ?? ""}
							id="expenses_amount"
							name="expenses_amount"
							type="number"
						/>
					</FormField>
					<FormField htmlFor="location_text" label="Ubicación resumida" className="md:col-span-2">
						<Input
							defaultValue={initialValues?.location_text ?? ""}
							id="location_text"
							name="location_text"
						/>
					</FormField>
					<FormField htmlFor="city" label="Ciudad">
						<Input defaultValue={initialValues?.city ?? ""} id="city" name="city" />
					</FormField>
					<FormField htmlFor="neighborhood" label="Barrio">
						<Input
							defaultValue={initialValues?.neighborhood ?? ""}
							id="neighborhood"
							name="neighborhood"
						/>
					</FormField>
					<FormField htmlFor="address" label="Dirección" className="md:col-span-2">
						<Input defaultValue={initialValues?.address ?? ""} id="address" name="address" />
					</FormField>
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
					<FormField htmlFor="area_m2" label="Superficie m²">
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
					<FormField htmlFor="description" label="Descripción" className="md:col-span-2">
						<Textarea
							defaultValue={initialValues?.description ?? ""}
							id="description"
							name="description"
						/>
					</FormField>
					<div className="grid gap-3 rounded-lg border border-border bg-slate-50 p-4 md:col-span-2 md:grid-cols-5">
						<label className="flex items-center gap-2 text-sm">
							<input
								defaultChecked={initialValues?.pets_allowed ?? false}
								name="pets_allowed"
								type="checkbox"
							/>
							Acepta mascotas
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input defaultChecked={initialValues?.furnished ?? false} name="furnished" type="checkbox" />
							Amoblada
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input defaultChecked={initialValues?.has_pool ?? false} name="has_pool" type="checkbox" />
							Piscina
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input defaultChecked={initialValues?.has_garden ?? false} name="has_garden" type="checkbox" />
							Jardín
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input defaultChecked={initialValues?.has_balcony ?? false} name="has_balcony" type="checkbox" />
							Balcón
						</label>
					</div>
				</CardContent>
			</Card>
			{state.message ? (
				<p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
					{state.message}
				</p>
			) : null}
			<div className="flex justify-end">
				<SubmitButton label="Guardar propiedad" pendingLabel="Guardando propiedad..." />
			</div>
		</form>
	);
}
