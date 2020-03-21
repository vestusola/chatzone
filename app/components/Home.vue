<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>

    <GridLayout>
      <Label class="info" horizontalAlignment="center" verticalAlignment="center">
        <FormattedString>
          <Span class="fa" text.decode="&#xf008;" />
          <Span :text="message" />
        </FormattedString>
      </Label>
    </GridLayout>
  </Page>
</template>

<script>
export default {
  computed: {
    message() {
      return "Welcome to NativeScript-Vue App";
    }
  }
};
</script>

<style scoped lang="scss">
  // Start custom common variables
  @import "../app";
  // End custom common variables

  // Custom styles
  .fa {
    color: $accent-dark;
  }

  .info {
    font-size: 20;
  }
</style>
