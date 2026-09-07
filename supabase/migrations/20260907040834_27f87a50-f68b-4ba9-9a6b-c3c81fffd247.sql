-- Enquiries: ensure no client can ever read/modify PII
REVOKE SELECT, UPDATE, DELETE ON public.enquiries FROM anon, authenticated;
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;

DROP POLICY IF EXISTS "Enquiries are not publicly readable" ON public.enquiries;
CREATE POLICY "Enquiries are not publicly readable"
  ON public.enquiries FOR SELECT TO anon, authenticated
  USING (false);

-- Storage: explicit policies for the private site-photos bucket
DROP POLICY IF EXISTS "site-photos no public read" ON storage.objects;
DROP POLICY IF EXISTS "site-photos no public insert" ON storage.objects;
DROP POLICY IF EXISTS "site-photos no public update" ON storage.objects;
DROP POLICY IF EXISTS "site-photos no public delete" ON storage.objects;

CREATE POLICY "site-photos no public read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (false);

CREATE POLICY "site-photos no public insert"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "site-photos no public update"
  ON storage.objects FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "site-photos no public delete"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (false);