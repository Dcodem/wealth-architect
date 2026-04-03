import { send } from "@/lib/messaging/send";
import { vendorWorkOrder } from "@/lib/messaging/templates";
import { updateCase, addTimelineEntry } from "@/lib/db/queries/cases";
import type { Vendor, Property, Case } from "@/lib/db/schema";

export async function dispatchVendor(params: {
  vendor: Vendor;
  property: Property;
  caseRecord: Case;
  issueDescription: string;
  orgId: string;
  orgPhoneNumber: string | null;
  orgEmail: string | null;
}) {
  const { vendor, property, caseRecord, issueDescription, orgId } = params;

  const caseRef = `WO-${property.address.split(" ")[0]}-${caseRecord.id.slice(0, 4)}`;

  const workOrderBody = vendorWorkOrder({
    vendorName: vendor.name,
    address: property.address,
    unitNumber: undefined, // TODO: pull from tenant
    issueDescription,
    priority: caseRecord.urgency || "medium",
    accessInstructions: property.accessInstructions || undefined,
    parkingInstructions: property.parkingInstructions || undefined,
    specialInstructions: property.specialInstructions || undefined,
    caseRef,
  });

  // Prefer SMS for vendor dispatch, fall back to email
  const channel = vendor.phone ? "sms" : "email";
  const to = vendor.phone || vendor.email;
  const from = channel === "sms" ? params.orgPhoneNumber : params.orgEmail;

  if (!to || !from) {
    await addTimelineEntry(caseRecord.id, {
      type: "dispatched_vendor",
      details: `Could not dispatch ${vendor.name} — no contact info or org channel not configured`,
      metadata: { vendorId: vendor.id, error: "no_contact" },
    });
    return { success: false, error: "No contact info" };
  }

  const result = await send({
    channel,
    to,
    from,
    subject: channel === "email" ? `Work Order: ${issueDescription.substring(0, 50)}` : undefined,
    body: workOrderBody,
    orgId,
    caseId: caseRecord.id,
    messageType: "vendor_dispatch",
  });

  // Update case with vendor
  await updateCase(caseRecord.id, orgId, {
    vendorId: vendor.id,
    status: "waiting_on_vendor",
  });

  // Log to timeline
  await addTimelineEntry(caseRecord.id, {
    type: "dispatched_vendor",
    details: `Dispatched ${vendor.name} (${vendor.trade}) via ${channel}`,
    metadata: {
      vendorId: vendor.id,
      vendorName: vendor.name,
      channel,
      caseRef,
      success: result.success,
    },
  });

  return result;
}
