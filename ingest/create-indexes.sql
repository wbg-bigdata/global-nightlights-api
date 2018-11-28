
ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);

CREATE INDEX observations_position_id_idx ON public.observations USING btree ("position_id");


CREATE INDEX observations_scanned_at_idx ON public.observations USING btree (scanned_at);


CREATE INDEX positions_geometry_gix ON public.positions USING gist (geometry);


CREATE INDEX positions_geometry_idx ON public.positions USING gist (geometry);
