import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useFormDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { ProductCategoriesQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyProductCategory, formToAddDto } from "../utils";

// types
import type { ProductCategoryFormType } from "../types";

// lib
import type { AddProductCategoryDto, ProductCategoryDto } from "lib/entities";

export function useAddProductCategoryDialog() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    ProductCategoryDto,
    AddProductCategoryDto,
    ProductCategoryDto,
    ProductCategoryFormType
  >({
    formToDto: formToAddDto,
    dtoToForm,
    defaultValues: emptyProductCategory,
    mutationFn: (data) => manager.ProductCategories.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:checklists.forms.add"),
    ...ProductCategoriesQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
