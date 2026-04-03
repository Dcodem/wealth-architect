-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timeline ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's org_id
CREATE OR REPLACE FUNCTION auth.user_org_id()
RETURNS uuid AS $$
  SELECT org_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Organizations: users can only see their own org
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id = auth.user_org_id());

CREATE POLICY "Users can update their own organization"
  ON organizations FOR UPDATE
  USING (id = auth.user_org_id());

-- Users: users can only see users in their org
CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (org_id = auth.user_org_id());

-- Properties: org-scoped
CREATE POLICY "Org members can view properties"
  ON properties FOR SELECT
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can insert properties"
  ON properties FOR INSERT
  WITH CHECK (org_id = auth.user_org_id());

CREATE POLICY "Org members can update properties"
  ON properties FOR UPDATE
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can delete properties"
  ON properties FOR DELETE
  USING (org_id = auth.user_org_id());

-- Tenants: org-scoped
CREATE POLICY "Org members can view tenants"
  ON tenants FOR SELECT
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can insert tenants"
  ON tenants FOR INSERT
  WITH CHECK (org_id = auth.user_org_id());

CREATE POLICY "Org members can update tenants"
  ON tenants FOR UPDATE
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can delete tenants"
  ON tenants FOR DELETE
  USING (org_id = auth.user_org_id());

-- Vendors: org-scoped
CREATE POLICY "Org members can view vendors"
  ON vendors FOR SELECT
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can insert vendors"
  ON vendors FOR INSERT
  WITH CHECK (org_id = auth.user_org_id());

CREATE POLICY "Org members can update vendors"
  ON vendors FOR UPDATE
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can delete vendors"
  ON vendors FOR DELETE
  USING (org_id = auth.user_org_id());

-- Cases: org-scoped
CREATE POLICY "Org members can view cases"
  ON cases FOR SELECT
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can insert cases"
  ON cases FOR INSERT
  WITH CHECK (org_id = auth.user_org_id());

CREATE POLICY "Org members can update cases"
  ON cases FOR UPDATE
  USING (org_id = auth.user_org_id());

-- Case timeline: accessible through case (org-scoped via join)
CREATE POLICY "Org members can view case timeline"
  ON case_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_timeline.case_id
      AND cases.org_id = auth.user_org_id()
    )
  );

CREATE POLICY "Org members can insert case timeline"
  ON case_timeline FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_timeline.case_id
      AND cases.org_id = auth.user_org_id()
    )
  );

-- Processed messages: org-scoped
ALTER TABLE processed_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view processed messages"
  ON processed_messages FOR SELECT
  USING (org_id = auth.user_org_id());

CREATE POLICY "Org members can insert processed messages"
  ON processed_messages FOR INSERT
  WITH CHECK (org_id = auth.user_org_id());

-- Unique constraint for deduplication (per-org)
CREATE UNIQUE INDEX idx_processed_messages_org_external
  ON processed_messages (org_id, external_message_id);

-- Service role bypass: Inngest and webhooks use the service role key,
-- which bypasses RLS. This is intentional — the application layer
-- enforces org_id scoping for these code paths.
